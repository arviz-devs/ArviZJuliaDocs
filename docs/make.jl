using Downloads
using MultiDocumenter

@enum Tag registered unregistered experimental external

struct PkgInfo
    name::String
    org::String
    tag::Tag
end
PkgInfo(name; org="arviz-devs", tag=registered) = PkgInfo(name, org, tag)

packages = [
    PkgInfo("ArviZ"),
    "Plots" => [PkgInfo("ArviZPythonPlots"), PkgInfo("ArviZPlots"; tag=unregistered)],
    "Stats" => [PkgInfo("PosteriorStats"), PkgInfo("PSIS")],
    "Diagnostics" => [PkgInfo("MCMCDiagnosticTools"; org="TuringLang")],
    "Data" => [
        PkgInfo("InferenceObjects"),
        PkgInfo("ArviZExampleData"),
        # PkgInfo("DimensionalData"; org="rafaqz", tag=external),
        # PkgInfo("ArviZGen"; tag=experimental),
    ],
]

function dropdown(info::PkgInfo; clone_dir::String)
    name = info.name * (info.tag == registered ? "" : " ($(info.tag))")
    if info.tag == external
        link = "https://$(info.org).github.io/$(info.name).jl/"
        return MultiDocumenter.Link(name, link)
    end
    return MultiDocumenter.MultiDocRef(;
        upstream=joinpath(clone_dir, info.name),
        path=info.name,
        name=name,
        giturl="https://github.com/$(info.org)/$(info.name).jl.git",
        fix_canonical_url=(info.tag == registered),
    )
end
function dropdown((section_name, packages)::Pair{String,Vector{PkgInfo}}; clone_dir::String)
    refs = [dropdown(info; clone_dir) for info in packages]
    return MultiDocumenter.DropdownNav(section_name, refs)
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
        (endswith(file, ".git") || (basename(file) == "CNAME")) && continue
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

function make(;
    clone_dir::String="", out_dir::String="", deploy::Bool=false
)
    if isempty(clone_dir)
        clone_dir = mktempdir(; cleanup=false)
    end

    if isempty(out_dir)
        out_dir = mktempdir(; cleanup=false)
    end

    MultiDocumenter.make(
        out_dir,
        [dropdown(pkgs_info; clone_dir) for pkgs_info in packages];
        search_engine=MultiDocumenter.SearchConfig(;
            index_versions=["stable"], engine=MultiDocumenter.FlexSearch
        ),
        brand_image=MultiDocumenter.BrandImage(".", joinpath("assets", "logo.png")),
        custom_stylesheets=[joinpath("assets", "hide_turing_menu.css")],
        custom_scripts=Any[joinpath("assets", "hide_turing_menu.js")],
    )

    # download logo
    assets_dir = joinpath(out_dir, "assets")
    mkpath(assets_dir)
    Downloads.download(
        "https://raw.githubusercontent.com/arviz-devs/arviz-project/main/arviz_logos/ArviZ_fav.png",
        joinpath(assets_dir, "logo.png");
        verbose=true,
    )
    for fn in ["hide_turing_menu.js", "hide_turing_menu.css"]
        cp(joinpath(@__DIR__, "assets", fn), joinpath(assets_dir, fn))
    end

    # deploy to GitHub Pages
    git_root = normpath(joinpath(@__DIR__, ".."))
    deploy && deploy_to_ghpages(git_root, out_dir)
    return nothing
end

make()
