from setuptools import setup, find_packages


__version__ = "0.0.1"


setup(
    name="pvlogweb",
    version=__version__,
    description="Pvlog web interface",
    author="",
    author_email="",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "Babel",
        "Flask",
        "Flask-Babel",
        "Flask-HTTPAuth",
        "Flask-Session",
        "Flask-Webpack",
        "requests",
    ]
)
