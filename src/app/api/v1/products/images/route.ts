import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

import { apiErrors, apiSuccess, withApiHandler } from "@/server";

const acceptedImageTypes = new Map([
  ["image/gif", "gif"],
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const maxImageSizeBytes = 5 * 1024 * 1024;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = withApiHandler(async (request) => {
  const formData = await request.formData();
  const image = formData.get("image");

  if (!(image instanceof File)) {
    throw apiErrors.validation("Product image is required.", {
      imageSrc: "Choose a product image file.",
    });
  }

  const extension = acceptedImageTypes.get(image.type);

  if (!extension) {
    throw apiErrors.validation("Product image type is invalid.", {
      imageSrc: "Choose a PNG, JPG, WEBP, or GIF image.",
    });
  }

  if (image.size > maxImageSizeBytes) {
    throw apiErrors.validation("Product image is too large.", {
      imageSrc: "Choose an image smaller than 5 MB.",
    });
  }

  const uploadDirectory = join(process.cwd(), "public", "uploads", "products");
  const fileName = `${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await image.arrayBuffer());

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(join(uploadDirectory, fileName), bytes);

  return apiSuccess(
    {
      imageSrc: `/uploads/products/${fileName}`,
    },
    { status: 201 },
  );
});
