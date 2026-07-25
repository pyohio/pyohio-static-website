"""Title-case strings using Wikipedia's Manual of Style rules.

Wikipedia lowercases articles, coordinating conjunctions, and prepositions of
four letters or fewer, while always capitalizing the first and last word and the
first word of a subtitle (after a colon). The first word after sentence-ending
punctuation (``.``, ``?``, ``!``) is also capitalized. Words with intentional
internal capitals (acronyms and camelCase such as ``SQL``, ``LLMs``, ``CPython``)
are left untouched.

Reference: https://en.wikipedia.org/wiki/Wikipedia:Manual_of_Style/Titles
"""

from __future__ import annotations

import re

# Words kept lowercase unless they are the first/last word or start a subtitle.
LOWERCASE_WORDS = {
    # articles
    "a", "an", "the",
    # coordinating conjunctions
    "and", "but", "or", "nor", "for", "yet", "so",
    # prepositions of four letters or fewer (plus "as")
    "as", "at", "by", "from", "in", "into", "of", "off", "on",
    "onto", "out", "over", "to", "up", "upon", "with",
}


def _alpha_key(word: str) -> str:
    """Lowercased alphabetic characters only, for lookup in LOWERCASE_WORDS."""
    return re.sub(r"[^a-z]", "", word.lower())


def _capitalize(word: str) -> str:
    """Uppercase the first alphabetic character, leaving the rest unchanged.

    Leading punctuation (quotes, brackets) is skipped so ``"tracker's`` becomes
    ``"Tracker's``.
    """
    match = re.search(r"[A-Za-z]", word)
    if not match:
        return word
    i = match.start()
    return word[:i] + word[i].upper() + word[i + 1:]


def _has_internal_caps(word: str) -> bool:
    """True if the word carries intentional casing (acronym / camelCase)."""
    return any(ch.isupper() for ch in word[1:])


def titlecase(title: str) -> str:
    """Return ``title`` cased per Wikipedia's Manual of Style."""
    words = title.split(" ")
    last = len(words) - 1
    prev_ends_boundary = False
    result: list[str] = []

    for idx, word in enumerate(words):
        if not word:
            result.append(word)
            continue

        if _has_internal_caps(word):
            result.append(word)
        else:
            force_cap = idx == 0 or idx == last or prev_ends_boundary
            if not force_cap and _alpha_key(word) in LOWERCASE_WORDS:
                result.append(word.lower())
            else:
                result.append(_capitalize(word))

        # A colon starts a subtitle; . ? ! end a sentence. The next word after
        # any of these is capitalized.
        prev_ends_boundary = word.endswith((":", ".", "?", "!"))

    return " ".join(result)
