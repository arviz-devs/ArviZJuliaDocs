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
mkpath(assets_dir)
Downloads.download(
    "https://raw.githubusercontent.com/arviz-devs/arviz-project/main/arviz_logos/ArviZ_fav.png",
    joinpath(assets_dir, "logo.png");
    verbose=true,
)

# deploy to GitHub Pages
git_root = normpath(joinpath(@__DIR__, ".."))
deploy_to_ghpages(git_root, out_dir)
