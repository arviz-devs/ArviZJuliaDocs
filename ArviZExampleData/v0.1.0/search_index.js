var documenterSearchIndex = {"docs":
[{"location":"api/#API","page":"API","title":"API","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Modules = [ArviZExampleData]\nPrivate = false","category":"page"},{"location":"api/#ArviZExampleData.describe_example_data","page":"API","title":"ArviZExampleData.describe_example_data","text":"describe_example_data() -> String\n\nReturn a string containing descriptions of all available datasets.\n\nExamples\n\njulia> describe_example_data(\"radon\") |> println\nradon\n=====\n\nRadon is a radioactive gas that enters homes through contact points with the ground. It is a carcinogen that is the primary cause of lung cancer in non-smokers. Radon levels vary greatly from household to household.\n\nThis example uses an EPA study of radon levels in houses in Minnesota to construct a model with a hierarchy over households within a county. The model includes estimates (gamma) for contextual effects of the uranium per household.\n\nSee Gelman and Hill (2006) for details on the example, or https://docs.pymc.io/notebooks/multilevel_modeling.html by Chris Fonnesbeck for details on this implementation.\n\nremote: http://ndownloader.figshare.com/files/24067472\n\n\n\n\n\n","category":"function"},{"location":"api/#ArviZExampleData.load_example_data","page":"API","title":"ArviZExampleData.load_example_data","text":"load_example_data(name; kwargs...) -> InferenceObjects.InferenceData\nload_example_data() -> Dict{String,AbstractFileMetadata}\n\nLoad a local or remote pre-made dataset.\n\nkwargs are forwarded to InferenceObjects.from_netcdf.\n\nPass no parameters to get a Dict listing all available datasets.\n\nData files are handled by DataDeps.jl. A file is downloaded only when it is requested and then cached for future use.\n\nExamples\n\njulia> keys(load_example_data())\nKeySet for a OrderedCollections.OrderedDict{String, ArviZExampleData.AbstractFileMetadata} with 9 entries. Keys:\n  \"centered_eight\"\n  \"non_centered_eight\"\n  \"radon\"\n  \"rugby\"\n  \"regression1d\"\n  \"regression10d\"\n  \"classification1d\"\n  \"classification10d\"\n  \"glycan_torsion_angles\"\n\njulia> load_example_data(\"centered_eight\")\nInferenceData with groups:\n  > posterior\n  > posterior_predictive\n  > sample_stats\n  > prior\n  > observed_data\n\n\n\n\n\n","category":"function"},{"location":"for_developers/#For-developers","page":"For developers","title":"For developers","text":"","category":"section"},{"location":"for_developers/","page":"For developers","title":"For developers","text":"This package has arviz_example_data as a data dependency, which is included as an artifact.","category":"page"},{"location":"for_developers/","page":"For developers","title":"For developers","text":"When arviz_example_data is updated, and a new release is made, Artifacts.toml should be updated to point to the new tarball corresponding to the release:","category":"page"},{"location":"for_developers/","page":"For developers","title":"For developers","text":"julia> using ArtifactUtils\n\njulia> version = v\"0.1.0\";\n\njulia> tarball_url = \"https://github.com/arviz-devs/arviz_example_data/archive/refs/tags/v$version.tar.gz\";\n\njulia> add_artifact!(\"Artifacts.toml\", \"arviz_example_data\", tarball_url; force=true);","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = ArviZExampleData","category":"page"},{"location":"#ArviZExampleData","page":"Home","title":"ArviZExampleData","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"(Image: Build Status) (Image: Coverage) (Image: ColPrac: Contributor's Guide on Collaborative Practices for Community Packages) (Image: Powered by NumFOCUS)","category":"page"},{"location":"","page":"Home","title":"Home","text":"Utilities for loading datasets defined in the arviz_example_data repository. The resulting objects are InferenceObjects.jl's InferenceData.  These utilities are used in ArviZ.jl.","category":"page"},{"location":"datasets/#Datasets","page":"Datasets","title":"Datasets","text":"","category":"section"},{"location":"datasets/","page":"Datasets","title":"Datasets","text":"The following shows the currently available example datasets:","category":"page"},{"location":"datasets/","page":"Datasets","title":"Datasets","text":"using ArviZExampleData\n\nprintln(describe_example_data())","category":"page"}]
}
