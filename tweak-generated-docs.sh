# The latest typedoc output is a bit verbose and doesn't include the project intro header, this tweaks the output
mv docs/README.md docs/README.original.md
cat INTRO.md > docs/README.md
tail -n +6 docs/README.original.md >> docs/README.md
rm docs/README.original.md
