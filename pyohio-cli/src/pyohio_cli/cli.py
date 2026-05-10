import click

from pyohio_cli.og import og
from pyohio_cli.pretalx import pretalx
from pyohio_cli.sponsors import sponsors


@click.group()
def cli():
    """PyOhio site automation CLI."""


cli.add_command(sponsors)
cli.add_command(pretalx)
cli.add_command(og)


if __name__ == "__main__":
    cli()
