// pages/api/saved-lists.ts (or app/api/saved-lists/route.ts)
import { createSavedListAction } from "@/actions/savedList.actions";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { name,  isPrivate, isDefault } = req.body;
  const { success, data, error } = await createSavedListAction({ name, isPrivate, isDefault });
  if (!success) return res.status(400).json({ error });
  return res.status(201).json({ list: data?.list });
}
