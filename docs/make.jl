using Downloads
using MultiDocumenter

clonedir = mktempdir()

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

function multi_doc_ref(pkg_name, org="arviz-devs")
    return MultiDocumenter.MultiDocRef(;
        upstream=joinpath(clonedir, pkg_name),
        path=pkg_name,
        name=pkg_name,
        giturl="https://github.com/$(org)/$(pkg_name).jl.git",
    )
end

docs = [
    map(Base.splat(multi_doc_ref), packages)...,
    MultiDocumenter.DropdownNav("Experimental", map(Base.splat(multi_doc_ref), packages_experimental)),
]

outpath = mktempdir()

MultiDocumenter.make(
    outpath,
    docs;
    search_engine=MultiDocumenter.SearchConfig(;
        index_versions=["stable"], engine=MultiDocumenter.FlexSearch
    ),
    brand_image=MultiDocumenter.BrandImage(".", joinpath("assets", "logo.png")),
)

# download logo
assets_dir = joinpath(outpath, "assets")
mkpath(assets_dir)
Downloads.download(
    "https://raw.githubusercontent.com/arviz-devs/arviz-project/main/arviz_logos/ArviZ_fav.png",
    joinpath(assets_dir, "logo.png");
    verbose=true,
)

gitroot = normpath(joinpath(@__DIR__, ".."))
run(`git pull`)
outbranch = "gh-pages"
has_outbranch = true
if !success(`git checkout $outbranch`)
    has_outbranch = false
    if !success(`git switch --orphan $outbranch`)
        @error "Cannot create new orphaned branch $outbranch."
        exit(1)
    end
end
for file in readdir(gitroot; join=true)
    endswith(file, ".git") && continue
    rm(file; force=true, recursive=true)
end
for file in readdir(outpath)
    cp(joinpath(outpath, file), joinpath(gitroot, file))
end
run(`git add .`)
if success(`git commit -m 'Aggregate documentation'`)
    @info "Pushing updated documentation."
    if has_outbranch
        run(`git push`)
    else
        run(`git push -u origin $outbranch`)
    end
    run(`git checkout main`)
else
    @info "No changes to aggregated documentation."
end
