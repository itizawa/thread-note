import { OgpCard } from "@/components/ui/MarkdownViewer/OgpCard";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Image } from "./Image";
import { YouTube } from "@next/third-parties/google"; // P224a

const YouTubeEmbed: React.FC<{ url: string }> = ({ url }) => { // P99aa
  const videoId = url.split("v=")[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return (
    <div className="youtube-embed">
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export const MarkdownViewer: React.FC<{ body: string }> = ({ body }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold border-b pb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold mt-4 border-b pb-1">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mt-3">{children}</h3>
        ),
        p: ({ node, children }) => {
          const child = node?.children[0];
          if (
            node?.children.length === 1 &&
            child?.type === "element" &&
            child.tagName === "a" &&
            typeof child.properties?.href === "string" &&
            child.children[0].type === "text" &&
            child.properties.href === child.children[0].value
          ) {
            if (/(https?:\/\/[^\s]+)/g.test(child.properties.href)) {
              if (child.properties.href.includes("youtube.com/watch")) { // Pfd87
                return <YouTubeEmbed url={child.properties.href} />;
              }
              return <OgpCard url={child.properties.href} />;
            }
          }

          return <p className="text-gray-800">{children}</p>;
        },
        ul: ({ children }) => (
          <ul className="list-disc ml-5 space-y-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal ml-5 space-y-1">{children}</ol>
        ),
        li: ({ children }) => <li className="text-gray-800">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-600">
            {children}
          </blockquote>
        ),
        pre: ({ children }) => (
          <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto ">
            {children}
          </pre>
        ),
        code: ({ children }) => (
          <code className="px-1 py-0.5 rounded">{children}</code>
        ),
        table: ({ children }) => (
          <table className="table-auto border-collapse border border-gray-300">
            {children}
          </table>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-200">{children}</thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => <tr className="border-b">{children}</tr>,
        th: ({ children }) => (
          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-300 px-4 py-2">{children}</td>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => <Image src={src} alt={alt} />,
      }}
    >
      {body}
    </ReactMarkdown>
  );
};
