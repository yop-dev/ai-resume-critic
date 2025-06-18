import pdf from 'pdf-parse';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const buffer = Buffer.from(req.body.pdfBase64, 'base64');
    const data = await pdf(buffer);
    res.status(200).json({ text: data.text });
  } catch (err) {
    res.status(500).json({ error: 'Failed to extract PDF text' });
  }
}
