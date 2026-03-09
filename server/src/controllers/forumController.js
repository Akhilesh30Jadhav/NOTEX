import prisma from '../config/db.js';

export const getPosts = async (req, res, next) => {
  try {
    const { subject, search } = req.query;
    const where = {};
    if (subject) where.subject = subject;
    if (search) where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { body: { contains: search, mode: 'insensitive' } }
    ];
    const posts = await prisma.forumPost.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        upvotes: { select: { id: true } },
        answers: {
          include: {
            author: { select: { id: true, name: true, avatar: true } },
            upvotes: { select: { id: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(posts);
  } catch (err) { next(err); }
};

export const createPost = async (req, res, next) => {
  try {
    const post = await prisma.forumPost.create({
      data: {
        subject: req.body.subject,
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags || [],
        authorId: req.user.id
      },
      include: { author: { select: { id: true, name: true, avatar: true } } }
    });
    res.status(201).json(post);
  } catch (err) { next(err); }
};

export const addAnswer = async (req, res, next) => {
  try {
    const post = await prisma.forumPost.findUnique({ where: { id: req.params.id } });
    if (!post) { res.status(404); throw new Error('Post not found'); }
    await prisma.forumAnswer.create({
      data: { postId: req.params.id, authorId: req.user.id, body: req.body.body }
    });
    const populated = await prisma.forumPost.findUnique({
      where: { id: req.params.id },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        upvotes: { select: { id: true } },
        answers: {
          include: {
            author: { select: { id: true, name: true, avatar: true } },
            upvotes: { select: { id: true } }
          }
        }
      }
    });
    res.json(populated);
  } catch (err) { next(err); }
};

export const toggleUpvote = async (req, res, next) => {
  try {
    const post = await prisma.forumPost.findUnique({
      where: { id: req.params.id },
      include: { upvotes: { select: { id: true } } }
    });
    if (!post) { res.status(404); throw new Error('Post not found'); }
    const hasUpvoted = post.upvotes.some(u => u.id === req.user.id);
    await prisma.forumPost.update({
      where: { id: req.params.id },
      data: {
        upvotes: hasUpvoted
          ? { disconnect: { id: req.user.id } }
          : { connect: { id: req.user.id } }
      }
    });
    const updated = await prisma.forumPost.findUnique({
      where: { id: req.params.id },
      include: { upvotes: { select: { id: true } } }
    });
    res.json({ upvotes: updated.upvotes.length });
  } catch (err) { next(err); }
};
