import Image from "next/image";
import type { ContentBlock } from "@/models/content";

export function RichText({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="rich-text">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return block.level === 2 ? (
              <h2 key={index}>{block.text}</h2>
            ) : (
              <h3 key={index}>{block.text}</h3>
            );
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "list":
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "image":
            return (
              <Image
                key={index}
                src={block.src}
                alt={block.alt}
                width={1200}
                height={800}
                sizes="(max-width: 767px) 100vw, 700px"
              />
            );
        }
      })}
    </div>
  );
}
