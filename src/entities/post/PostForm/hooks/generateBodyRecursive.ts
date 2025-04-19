export function generateBodyRecursive(post: {
  body: string;
  children?: Array<{ body: string }>;
}) {
  const rows: string[] = [];

  rows.push(post.body);
  if (post.children) {
    post.children.forEach((child) => rows.push(child.body));
  }

  return rows.join("\n\n");
}
