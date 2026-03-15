import { useSupabase } from "#server/modules/supabase";

const { concurrentImageDownloadLimit } = useRuntimeConfig();
// const concurrentImageDownloadLimit = 2;
let activeRequests = 0;
const queue: { resolve: () => void }[] = [];

function runNext() {
  if (activeRequests >= concurrentImageDownloadLimit) return;
  if (queue.length === 0) return;

  const item = queue.shift();
  if (!item) return;

  activeRequests++;
  item.resolve();
}

function acquire() {
  return new Promise<void>((resolve) => {
    queue.push({ resolve });
    runNext();
  });
}

function release() {
  activeRequests--;
  runNext();
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const path = getRouterParam(event, "path");
  const supabase = useSupabase();

  await acquire();

  try {
    const { data, error } = await supabase.storage
      .from(config.s3BucketName)
      .download(path);

    if (error || !data) {
      throw createError({
        statusCode: 404,
        message: "Image not found",
      });
    }

    setHeaders(event, {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": data.type || "image/jpeg",
    });

    // await new Promise(res => setTimeout(res, 10000, true));
    return data.stream();
  } finally {
    release();
  }
});