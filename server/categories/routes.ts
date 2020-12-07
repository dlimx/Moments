import express from 'express';
import {
  createCategory,
  deleteCategoryById,
  editCategoryById,
  getCategoryById,
  getAllCategories,
  patchCategoryById,
} from './controller';
import { sendError } from '../utils/error';
import { authenticate } from '../users/authenticate';
import { checkHeaders, getArrayDataWithSelf, getDataWithSelf, parseBase10Int } from '../utils/utils';
import { HttpStatus } from '../utils/http';

export const categoryRouter = express.Router();

categoryRouter.post('/', checkHeaders, authenticate, async (req, res, next) => {
  try {
    const data = await createCategory(req.body);
    res.status(HttpStatus.Created).send(getDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

categoryRouter.get('/', checkHeaders, authenticate, async (req, res, next) => {
  try {
    const cursor = req.query.cursor as string | undefined;
    const data = await getAllCategories(cursor);
    res.status(HttpStatus.Success).send({ ...data, data: getArrayDataWithSelf(req, data.data) });
  } catch (error) {
    sendError(res, error);
  }
});

categoryRouter.get('/:id', checkHeaders, authenticate, async (req, res, next) => {
  try {
    const data = await getCategoryById(parseBase10Int(req.params.id));
    res.status(HttpStatus.Success).send(getDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

categoryRouter.put('/:id', checkHeaders, authenticate, async (req, res, next) => {
  try {
    const data = await editCategoryById(parseBase10Int(req.params.id), req.body);

    res.status(HttpStatus.Success).send(getDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

categoryRouter.patch('/:id', checkHeaders, authenticate, async (req, res, next) => {
  try {
    const data = await patchCategoryById(parseBase10Int(req.params.id), req.body);

    res.status(HttpStatus.Success).send(getDataWithSelf(req, data));
  } catch (error) {
    sendError(res, error);
  }
});

categoryRouter.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await deleteCategoryById(parseBase10Int(req.params.id));
    res.status(HttpStatus.NoContent).send(null);
  } catch (error) {
    sendError(res, error);
  }
});
