import ReactMarkdown from "react-markdown"
import SyntaxHighlighter from "react-syntax-highlighter"
import simplePlantUML from "@akebifiky/remark-simple-plantuml";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"

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
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={dracula as any}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                        />
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
