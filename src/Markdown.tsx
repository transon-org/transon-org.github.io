import ReactMarkdown from "react-markdown"
import simplePlantUML from "@akebifiky/remark-simple-plantuml";
import remarkGfm from "remark-gfm"
import { CodeBlock } from "./CodeBlock"

export function Markdown(props: { children?: string }) {
    if (!props.children) {
        return <></>
    }
    return (
        <ReactMarkdown
            children={props.children}
            remarkPlugins={[remarkGfm, simplePlantUML]}
            className="markdown"
            components={{
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <CodeBlock language={match[1]}>{String(children)}</CodeBlock>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    )
                }
            }}
        />
    )
}
