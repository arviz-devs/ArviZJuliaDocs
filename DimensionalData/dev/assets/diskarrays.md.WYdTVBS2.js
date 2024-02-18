import{_ as s,c as a,o as i,V as n}from"./chunks/framework.-hqW-2cI.js";const y=JSON.parse('{"title":"Example","description":"","frontmatter":{},"headers":[],"relativePath":"diskarrays.md","filePath":"diskarrays.md","lastUpdated":null}'),p={name:"diskarrays.md"},t=n(`<h3 id="diskarrays-jl-compatability-diskarrays-jl-compatability" tabindex="-1"><a href="https://github.com/meggart/DiskArrays.jl" target="_blank" rel="noreferrer">DiskArrays.jl</a> compatability {#<a href="https://github.com/meggart/DiskArrays.jl" target="_blank" rel="noreferrer">DiskArrays.jl</a>-compatability} <a class="header-anchor" href="#diskarrays-jl-compatability-diskarrays-jl-compatability" aria-label="Permalink to &quot;[DiskArrays.jl](https://github.com/meggart/DiskArrays.jl) compatability {#[DiskArrays.jl](https://github.com/meggart/DiskArrays.jl)-compatability}&quot;">​</a></h3><p>The combination of DiskArrays.jl and DimensionalData.jl is Julias answer to pythons <a href="https://xarray.dev/" target="_blank" rel="noreferrer">xarray</a>.</p><p>Rasters.jl and YAXArrays.jl are the user-facing tools building on this combination.</p><p>DiskArrays.jl is rarely used directly by users, but is present in most disk and cloud based spatial data packages in julia, including:</p><ul><li><p>ArchGDAL.jl</p></li><li><p>NetCDF.jl</p></li><li><p>Zarr.jl</p></li><li><p>NCDatasets.lj</p></li><li><p>GRIBDatasets.jl</p></li><li><p>CommonDataModel.jl</p></li><li><p>etc...</p></li></ul><p>So that lazy, chunked data access conforms to julias array interface but also scales to operating on terrabytes of data.</p><p>DiskArrays enables chunk ordered lazy application of:</p><ul><li><p>broadcast</p></li><li><p>reduce</p></li><li><p>iteration</p></li><li><p>generators</p></li><li><p>zip</p></li></ul><p>DimensionalData.jl is a common front-end for accessing DiskArrays.jl compatible datasets. Wherever An <code>AbstractDimArray</code> wraps a disk array we will do our best to make sure all of the DimensionalData.jl indexing and DiskArrays.jl lazy/chunked operations work together cleanly.</p><p>They have no direct dependency relationships, with but are intentionally designed to integrate via both adherence to julias <code>AbstractArray</code> interface, and by coordination during development of both packages.</p><h1 id="Example" tabindex="-1">Example <a class="header-anchor" href="#Example" aria-label="Permalink to &quot;Example {#Example}&quot;">​</a></h1><p>Out of the box integration.</p><p>DimensionalData.jl and DiskArrays.jl play nice no matter the size of the data. To make this all work in CI we will simulate some huge data by multiplying a huge <code>BitArray</code> with a <code>BigInt</code>, meant to make it 128 x larger in memory.</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">using</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DimensionalData, DiskArrays</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># This holds is a 100_100 * 50_000 \`BitArray\`</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">A </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> trues</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100_000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50_000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">diska </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> DiskArrays</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TestTypes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">AccessCountDiskArray</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(A; chunksize</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">))</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dima </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> DimArray</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(diska, (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">X</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.01</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.01</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">Y</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.02</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0.02</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)))</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>╭───────────────────────────────╮</span></span>
<span class="line"><span>│ 100000×50000 DimArray{Bool,2} │</span></span>
<span class="line"><span>├───────────────────────────────┴──────────────────────────────── dims ┐</span></span>
<span class="line"><span>  ↓ X Sampled{Float64} 0.01:0.01:1000.0 ForwardOrdered Regular Points,</span></span>
<span class="line"><span>  → Y Sampled{Float64} 0.02:0.02:1000.0 ForwardOrdered Regular Points</span></span>
<span class="line"><span>└──────────────────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span>    ↓ →   0.02  0.04  0.06  0.08  0.1  …  999.94  999.96  999.98  1000.0</span></span>
<span class="line"><span>    0.01  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span>    0.02  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span>    0.03  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span>    ⋮                             ⋮    ⋱                    ⋮     </span></span>
<span class="line"><span>  999.98  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span>  999.99  1     1     1     1     1         1       1       1        1</span></span>
<span class="line"><span> 1000.0   1     1     1     1     1         1       1       1        1</span></span></code></pre></div><h1 id="How-big-is-this-thing?" tabindex="-1">How big is this thing? <a class="header-anchor" href="#How-big-is-this-thing?" aria-label="Permalink to &quot;How big is this thing? {#How-big-is-this-thing?}&quot;">​</a></h1><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">GB </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> sizeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(A) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1e9</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>0.625</span></span></code></pre></div><p>Now if we multiply that by 2.0 they will be Float64, ie 64 x larger.</p><p>But:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dimb </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> view</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">permutedims</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dima </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> BigInt</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200000000000</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">), (X, Y)); X</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">99999</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">sizeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dimb)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>208</span></span></code></pre></div><p>The size should be:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">GB </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">sizeof</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">eltype</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dimb)) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> prod</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dimb))) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1e9</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>79.9992</span></span></code></pre></div><p>I&#39;m writing this on a laptop with only 32Gb or ram, but this runs instantly.</p><p>The trick is nothing happens until we index:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">diska</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">.</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">getindex_count</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>Base.RefValue{Int64}(4)</span></span></code></pre></div><p>These are just access for printing in the repl!</p><p>When we actually get data the calulations happen, and for real disk arrays the chunked reads too:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dimb[X</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, Y</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>╭───────────────────────────╮</span></span>
<span class="line"><span>│ 100×10 DimArray{BigInt,2} │</span></span>
<span class="line"><span>├───────────────────────────┴───────────────────────────────── dims ┐</span></span>
<span class="line"><span>  ↓ X Sampled{Float64} 0.01:0.01:1.0 ForwardOrdered Regular Points,</span></span>
<span class="line"><span>  → Y Sampled{Float64} 0.02:0.02:0.2 ForwardOrdered Regular Points</span></span>
<span class="line"><span>└───────────────────────────────────────────────────────────────────┘</span></span>
<span class="line"><span> ↓ →              0.02             0.04  …             0.18             0.2</span></span>
<span class="line"><span> 0.01  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span> 0.02  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span> 0.03  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span> ⋮                                       ⋱                              ⋮</span></span>
<span class="line"><span> 0.98  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span> 0.99  200000000000     200000000000        200000000000     200000000000</span></span>
<span class="line"><span> 1.0   200000000000     200000000000        200000000000     200000000000</span></span></code></pre></div>`,33),l=[t];function e(h,k,r,d,o,c){return i(),a("div",null,l)}const E=s(p,[["render",e]]);export{y as __pageData,E as default};
