
import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

const ParseHtml = ({ data }: { data: string }) => {
  return (
    <section
      className="
        product-description
        text-sm sm:text-base
        text-gray-800 dark:text-gray-200
        leading-relaxed
        space-y-3
        max-w-none
      "
    >
      <MDXRemote
        source={data}
        components={{
          h1: (props) => (
            <h1 className="text-xl font-semibold mt-6 mb-2" {...props} />
          ),
          h2: (props) => (
            <h2 className="text-lg font-semibold mt-5 mb-2" {...props} />
          ),
          h3: (props) => (
            <h3 className="text-base font-semibold mt-4 mb-1" {...props} />
          ),
          p: (props) => (
            <p className="text-gray-700 text-sm font-medium dark:text-gray-300" {...props} />
          ),
          ul: (props) => (
            <ul className="list-disc pl-5 space-y-1" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal pl-5 space-y-1" {...props} />
          ),
          li: (props) => (
            <li className="text-gray-800 text-sm  dark:text-gray-300" {...props} />
          ),
          blockquote: (props) => (
            <blockquote
              className="
                border-l-4 border-orange-400
                bg-gray-50 dark:bg-gray-800
                px-4 py-2 my-3 rounded
                text-sm italic
              "
              {...props}
            />
          ),
          code: (props) => (
            <code
              className="
                bg-gray-100 dark:bg-gray-800
                px-1 py-0.5 rounded
                text-xs
              "
              {...props}
            />
          ),
          pre: () => null, // ❌ hide code blocks completely
        }}
      />
    </section>
  );
};

export default ParseHtml;

