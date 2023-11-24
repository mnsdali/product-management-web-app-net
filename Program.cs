using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MiniProjet_.NET.Models;
using MiniProjet_.NET.Models.Data;
using MiniProjet_.NET.Models.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// my DB ###########################

builder.Services.AddDbContextPool<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SavMiniProjDBConnection")));

builder.Services.AddScoped<IProduitRepository, SqlProduitRepository>();
builder.Services.AddScoped<IVariationRepository, SqlVariationRepository>();
builder.Services.AddScoped<IPieceRepository, SqlPieceRepository>();
builder.Services.AddScoped<IArticleRepository, SqlArticleRepository>();
builder.Services.AddScoped<IRevendeurCommandeRepository, SqlRevendeurCommandeRepository>();
builder.Services.AddScoped<IPieceVariationRepository, SqlPieceVariationRepository>();
builder.Services.AddScoped<IDetailCommandeRepository, SqlDetailCommandeRevendeurRepository>();

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

/*JsonException: A possible object cycle was detected.
This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. 
Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles. 
Path: $.Produit.Variations.Produit.Variations.Produit.Variations.Produit.Variations.Produit.Variations
        .Produit.Variations.Produit.Variations.Produit.Variations.Produit.Variations.Produit.Variations.Id.
*/
builder.Services.AddControllersWithViews()
    .AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
);

/// END of MY DB CONFIG ############
/// 
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
