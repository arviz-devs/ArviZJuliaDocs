import{_ as e,c as a,o as t,V as s}from"./chunks/framework.-hqW-2cI.js";const b=JSON.parse('{"title":"Tables and DataFrames","description":"","frontmatter":{},"headers":[],"relativePath":"tables.md","filePath":"tables.md","lastUpdated":null}'),o={name:"tables.md"},n=s('<h1 id="Tables-and-DataFrames" tabindex="-1">Tables and DataFrames <a class="header-anchor" href="#Tables-and-DataFrames" aria-label="Permalink to &quot;Tables and DataFrames {#Tables-and-DataFrames}&quot;">​</a></h1><p>Tables.jl provides an ecosystem-wide interface to tabular data in julia, giving interop with DataFrames.jl, CSV.jl and hundreds of other packages that implement the standard.</p><p>DimensionalData.jl implements the Tables.jl interface for <code>AbstractDimArray</code> and <code>AbstractDimStack</code>. <code>DimStack</code> layers are unrolled so they are all the same size, and dimensions similarly loop over array strides to match the length of the largest layer.</p><p>Columns are given the <code>name</code> or the array or the stack layer key. <code>Dimension</code> columns use the <code>Symbol</code> version (the result of <code>DD.dim2key(dimension)</code>).</p><p>Looping of unevenly size dimensions and layers is done <em>lazily</em>, and does not allocate unless collected.</p>',5),r=[n];function l(d,i,c,m,h,p){return t(),a("div",null,r)}const u=e(o,[["render",l]]);export{b as __pageData,u as default};
