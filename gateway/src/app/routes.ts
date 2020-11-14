import { Router } from 'express';
import { getFeaturedProducts, searchProducts } from '../products';
import { searchPrograms } from '../programs';

const router = Router();

router.get('/products/featured', async (req, res) => {
  const hits = await getFeaturedProducts();
  return res.json(hits);
});

router.get('/products', async (req, res) => {
  const hits = await searchProducts(req.query.query as string, req.query);
  return res.json(hits);
});

router.get('/programs', async (req, res) => {
  const hits = await searchPrograms(
    req.query.query as string,
    req.query.exact === 'true'
  );
  return res.json(hits);
});

export default router;
