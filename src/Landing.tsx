import { Markdown } from "./Markdown";

// Landing content sourced from the engine README (D-20): the README is the sole
// owner of the pitch/install/comparison prose (engine RFC 0008), delivered here
// as the installed wheel's metadata long-description so it always matches the
// running engine version. Presentation (what to show, anchors) is site-owned.

const EXCLUDED_SECTIONS = new Set(['Development']);

function slugify(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^0-9a-z _-]/g, '')
        .replace(/ /g, '-');
}

interface ILandingSection {
    title: string;
    slug: string;
    body: string;
}

export function splitReadme(readme: string): { preamble: string; sections: ILandingSection[] } {
    const lines = readme.replace(/\r\n?/g, '\n').split('\n');
    // Drop the repo H1 title and badge images — the app renders its own header.
    let start = 0;
    while (
        start < lines.length &&
        (lines[start] === '' || lines[start].startsWith('# ') || lines[start].startsWith('!['))
    ) {
        start += 1;
    }
    const chunks: { title: string | null; body: string[] }[] = [{ title: null, body: [] }];
    for (const line of lines.slice(start)) {
        if (line.startsWith('## ')) {
            chunks.push({ title: line.slice(3).trim(), body: [] });
        } else {
            chunks[chunks.length - 1].body.push(line);
        }
    }
    const preamble = chunks[0].body.join('\n').trim();
    const sections = chunks
        .slice(1)
        .filter((chunk) => chunk.title !== null && !EXCLUDED_SECTIONS.has(chunk.title))
        .map((chunk) => ({
            title: chunk.title as string,
            slug: slugify(chunk.title as string),
            body: chunk.body.join('\n').trim(),
        }));
    return { preamble, sections };
}

export function Landing(props: { readme?: string | null }) {
    if (!props.readme) {
        return <></>;
    }
    const { preamble, sections } = splitReadme(props.readme);
    return (
        <section className="landing">
            <Markdown>{preamble}</Markdown>
            {sections.map((section) => (
                <section key={section.slug}>
                    <h3 id={section.slug}>
                        <a href={`#${section.slug}`} className="heading-anchor">{section.title}</a>
                    </h3>
                    <Markdown>{section.body}</Markdown>
                </section>
            ))}
        </section>
    );
}
