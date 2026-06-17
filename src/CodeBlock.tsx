import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ICodeBlockProps {
    language: string;
    children: string;
}

export function CodeBlock(props: ICodeBlockProps) {
    return (
        <SyntaxHighlighter
            style={dracula as any}
            language={props.language}
            PreTag="div"
        >
            {props.children.replace(/\n$/, "")}
        </SyntaxHighlighter>
    );
}
