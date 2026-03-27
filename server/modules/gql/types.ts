export type AppApolloContext = {
  appContext: boolean;
  config: {
    s3BucketName: string;
    fruitImagesLimit: number;
    fruitDepthLimit: number;
    listFruitsLimit: number;
  };
};