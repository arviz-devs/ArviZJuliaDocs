using MultiDocumenter

clonedir = mktempdir()

docs = [
    MultiDocumenter.MultiDocRef(;
        upstream=joinpath(clonedir, "InferenceObjects"),
        path="InferenceObjects",
        name="InferenceObjects",
        giturl="https://github.com/arviz-devs/InferenceObjects.jl.git",
    ),
    MultiDocumenter.MultiDocRef(;
        upstream=joinpath(clonedir, "ArviZ"),
        path="ArviZ",
        name="ArviZ",
        giturl="https://github.com/arviz-devs/ArviZ.jl.git",
    ),
    MultiDocumenter.MultiDocRef(;
        upstream=joinpath(clonedir, "ArviZExampleData"),
        path="ArviZExampleData",
        name="ArviZExampleData",
        giturl="https://github.com/arviz-devs/ArviZExampleData.jl.git",
    ),
    MultiDocumenter.MultiDocRef(;
        upstream=joinpath(clonedir, "PSIS"),
        path="PSIS",
        name="PSIS",
        giturl="https://github.com/arviz-devs/PSIS.jl.git",
    ),
]

outpath = mktempdir()

MultiDocumenter.make(
    outpath,
    docs;
    search_engine=MultiDocumenter.SearchConfig(;
        index_versions=["stable"], engine=MultiDocumenter.FlexSearch
    ),
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
