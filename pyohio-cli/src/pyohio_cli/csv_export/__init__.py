"""Speakers/talks CSV export.

The ``generate()`` core uses only the standard library, so it can run as a
Rockgarden post_collect hook under plain ``python3`` (see ``__main__``) in the
Netlify build, which has no ``uv``/``click``. The ``click`` CLI lives in
``cli`` and is imported lazily by the top-level CLI, never at package import.
"""
