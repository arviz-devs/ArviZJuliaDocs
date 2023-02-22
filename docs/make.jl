using Downloads
using MultiDocumenter

function multi_doc_ref(pkg_name, org="arviz-devs")
    return MultiDocumenter.MultiDocRef(;
        upstream=joinpath(clone_dir, pkg_name),
        path=pkg_name,
        name=pkg_name,
        giturl="https://github.com/$(org)/$(pkg_name).jl.git",
    )
end

function deploy_to_ghpages(git_root, out_dir)
    run(`git pull`)
    out_branch = "gh-pages"
    has_out_branch = true
    if !success(`git checkout $out_branch`)
        has_out_branch = false
        if !success(`git switch --orphan $out_branch`)
            @error "Cannot create new orphaned branch $out_branch."
            exit(1)
        end
    end
    for file in readdir(git_root; join=true)
        endswith(file, ".git") && continue
        rm(file; force=true, recursive=true)
    end
    for file in readdir(out_dir)
        cp(joinpath(out_dir, file), joinpath(git_root, file))
    end
    run(`git add .`)
    if success(`git commit -m 'Aggregate documentation'`)
        @info "Pushing updated documentation."
        if has_out_branch
            run(`git push`)
        else
            run(`git push -u origin $out_branch`)
        end
        run(`git checkout main`)
    else
        @info "No changes to aggregated documentation."
    end
    return nothing
end

clone_dir = mktempdir(; cleanup=false)
out_dir = mktempdir(; cleanup=false)

packages = [
    ("ArviZ", "arviz-devs"),
    ("InferenceObjects", "arviz-devs"),
    ("ArviZExampleData", "arviz-devs"),
    ("PSIS", "arviz-devs"),
    ("MCMCDiagnosticTools", "TuringLang"),
]
packages_experimental = [
    # ("ArviZGen", "arviz-devs"),
    ("ArviZPlots", "arviz-devs"),
]
packages_third_party = [("DimensionalData", "rafaqz")]

docs = [
    map(Base.splat(multi_doc_ref), packages)...,
    MultiDocumenter.DropdownNav(
        "Experimental", map(Base.splat(multi_doc_ref), packages_experimental)
    ),
    MultiDocumenter.DropdownNav(
        "Third-party", map(Base.splat(multi_doc_ref), packages_third_party)
    ),
]

# TODO: Remove if MultiDocumenter.jl ever ends up supporting non-root hosting.
# Related issue: https://github.com/JuliaComputing/MultiDocumenter.jl/issues/36
# HACK: Make search work properly.
# adapted from https://github.com/TuringLang/turinglang.github.io/pull/46
multidoc_path = "ArviZJuliaDocs"

function MultiDocumenter.FlexSearch.generate_index(root, docs, config)
    search_index = MultiDocumenter.FlexSearch.SearchIndex()
    MultiDocumenter.FlexSearch.walk_outputs(root, docs, config.index_versions) do path, file
        MultiDocumenter.FlexSearch.add_to_index!(
            search_index, "/$(multidoc_path)" * path, file
        )
    end

    return search_index
end

MultiDocumenter.make(
    out_dir,
    docs;
    search_engine=MultiDocumenter.SearchConfig(;
        index_versions=["stable"], engine=MultiDocumenter.FlexSearch
    ),
    brand_image=MultiDocumenter.BrandImage(".", joinpath("assets", "logo.png")),
)

# download logo
assets_dir = joinpath(out_dir, "assets")
Downloads.download(
    "https://raw.githubusercontent.com/arviz-devs/arviz-project/main/arviz_logos/ArviZ_fav.png",
    joinpath(assets_dir, "logo.png");
    verbose=true,
)

# HACK: Make search work properly.
# adapted from https://github.com/TuringLang/turinglang.github.io/pull/46
flexsearch_path = joinpath(assets_dir, "default", "flexsearch_integration.js")
run(`chmod a+rw $(flexsearch_path)`)
write(
    flexsearch_path,
    replace(
        read(flexsearch_path, String), "/search-data/" => "/$(multidoc_path)/search-data/"
    ),
)

# deploy to GitHub Pages
if haskey(ENV, "GITHUB_ACTIONS")
    git_root = normpath(joinpath(@__DIR__, ".."))
    deploy_to_ghpages(git_root, out_dir)
end
