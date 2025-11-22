import React from 'react'
import { Code } from "bright"
import { MDXRemote } from "next-mdx-remote/rsc"

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
}

const ParseHtml = ({ data }: { data: string }) => {
  return (
    <section className='prose prose-sm sm:prose-base  dark:prose-invert max-w-none wrap-break-word text-[#333] dark:text-[#ddd] leading-relaxed'>
      <MDXRemote
        source={data}
        components={{
          pre: (props) => (
            <div className='my-4 overflow-auto rounded-lg shadow-md bg-white dark:bg-[#1e1e1e]'>
              <Code
                {...props}
                className='p-4! text-sm!  leading-snug!'
              />
            </div>
          ),
        }}
      />
    </section>
  )
}

export default ParseHtml
