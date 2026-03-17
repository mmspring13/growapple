import { useSupabase } from "#server/modules/supabase";

const { concurrentImageDownloadLimit } = useRuntimeConfig();
let activeRequests = 0;
const queue: { resolve: () => void }[] = [];

function runNext() {
  if (activeRequests >= (concurrentImageDownloadLimit || 5)) return;
  if (queue.length === 0) return;

  const item = queue.shift();
  if (item) {
    activeRequests++;
    item.resolve();
  }
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
  const path = getRouterParam(event, "path")!;
  const supabase = useSupabase();

  await acquire();

  try {
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 8000)
    );

    const fetchPromise = (async () => {
      const { data, error } = await supabase.storage
        .from(config.s3BucketName)
        .download(path);

      if (error || !data) return null;
      return data;
    })();

    const result = await Promise.race([fetchPromise, timeoutPromise]);

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: "Image request timed out or not found",
      });
    }

    setHeaders(event, {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": result.type || "image/jpeg",
    });

    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    setHeaders(event, {
      "Content-Type": result.type || "image/jpeg",
      "Content-Length": buffer.length.toString(),
    });

    return buffer;

  } catch (err) {
    throw err.statusCode ? err : createError({ statusCode: 500, message: "Internal Error" });
  } finally {
    release();
  }
});