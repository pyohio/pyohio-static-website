import click

from pyohio_cli.sponsors import sponsors


@click.group()
def cli():
    """PyOhio site automation CLI."""


cli.add_command(sponsors)


if __name__ == "__main__":
    cli()
