using ArviZJuliaDocs
using Documenter

DocMeta.setdocmeta!(ArviZJuliaDocs, :DocTestSetup, :(using ArviZJuliaDocs); recursive=true)

makedocs(;
    modules=[ArviZJuliaDocs],
    authors="Seth Axen <seth@sethaxen.com> and contributors",
    repo="https://github.com/arviz-devs/ArviZJuliaDocs.jl/blob/{commit}{path}#{line}",
    sitename="ArviZJuliaDocs.jl",
    format=Documenter.HTML(;
        prettyurls=get(ENV, "CI", "false") == "true",
        canonical="https://arviz-devs.github.io/ArviZJuliaDocs.jl",
        edit_link="main",
        assets=String[],
    ),
    pages=[
        "Home" => "index.md",
    ],
)

deploydocs(;
    repo="github.com/arviz-devs/ArviZJuliaDocs.jl",
    devbranch="main",
)
