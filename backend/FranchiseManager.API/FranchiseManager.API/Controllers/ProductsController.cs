using FranchiseManager.API.Database;
using FranchiseManager.API.DTOs;
using FranchiseManager.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FranchiseManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// GET: api/products
        /// Gets all products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> Get()
        {
            var products = await _context.Products
                .Include(p => p.Branch)
                    .ThenInclude(b => b.Franchise)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Stock = p.Stock,
                    BranchId = p.BranchId,
                    BranchName = p.Branch != null ? p.Branch.Name : string.Empty,
                    FranchiseName = p.Branch != null && p.Branch.Franchise != null
                        ? p.Branch.Franchise.Name
                        : string.Empty
                })
                .ToListAsync();

            return Ok(products);
        }

        /// GET: api/products/5
        /// Gets a product by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> Get(int id)
        {
            // Validate that the ID is positive
            if (id <= 0)
            {
                return BadRequest(new { message = "ID must be greater than zero" });
            }

            var product = await _context.Products
                .Include(p => p.Branch)
                    .ThenInclude(b => b.Franchise)
                .Where(p => p.Id == id)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Stock = p.Stock,
                    BranchId = p.BranchId,
                    BranchName = p.Branch != null ? p.Branch.Name : string.Empty,
                    FranchiseName = p.Branch != null && p.Branch.Franchise != null
                        ? p.Branch.Franchise.Name
                        : string.Empty
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }

            return Ok(product);
        }

        /// GET: api/products/branch/5
        /// Gets all products of a specific branch
        [HttpGet("branch/{branchId}")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetByBranch(int branchId)
        {
            // Validate that the ID is positive
            if (branchId <= 0)
            {
                return BadRequest(new { message = "Branch ID must be greater than zero" });
            }

            // Check if the branch exists
            var branchExists = await _context.Branches.AnyAsync(b => b.Id == branchId);
            if (!branchExists)
            {
                return NotFound(new { message = $"Branch with ID {branchId} not found" });
            }

            var products = await _context.Products
                .Where(p => p.BranchId == branchId)
                .Include(p => p.Branch)
                    .ThenInclude(b => b.Franchise)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Stock = p.Stock,
                    BranchId = p.BranchId,
                    BranchName = p.Branch != null ? p.Branch.Name : string.Empty,
                    FranchiseName = p.Branch != null && p.Branch.Franchise != null
                        ? p.Branch.Franchise.Name
                        : string.Empty
                })
                .ToListAsync();

            return Ok(products);
        }

        /// GET: api/products/search?name=
        /// Searches products by name (partial search)
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> Search([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Search term is required" });
            }

            if (name.Length < 2)
            {
                return BadRequest(new { message = "Search term must be at least 2 characters long" });
            }

            var products = await _context.Products
                .Where(p => p.Name.Contains(name))
                .Include(p => p.Branch)
                    .ThenInclude(b => b.Franchise)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Stock = p.Stock,
                    BranchId = p.BranchId,
                    BranchName = p.Branch != null ? p.Branch.Name : string.Empty,
                    FranchiseName = p.Branch != null && p.Branch.Franchise != null
                        ? p.Branch.Franchise.Name
                        : string.Empty
                })
                .ToListAsync();

            return Ok(products);
        }

        /// POST: api/products
        /// Creates a new product
        [HttpPost]
        public async Task<ActionResult<ProductDto>> Post([FromBody] CreateProductDto createProductDto)
        {
            // Model validation (Data Annotations)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Additional validations
            if (string.IsNullOrWhiteSpace(createProductDto.Name))
            {
                ModelState.AddModelError("Name", "Product name is required");
                return BadRequest(ModelState);
            }

            // Note: Non-negative stock validation is already in Data Annotations
            // but we keep this as a backup
            if (createProductDto.Stock < 0)
            {
                ModelState.AddModelError("Stock", "Stock cannot be negative");
                return BadRequest(ModelState);
            }

            // Verify that the branch exists
            var branch = await _context.Branches
                .Include(b => b.Franchise)
                .FirstOrDefaultAsync(b => b.Id == createProductDto.BranchId);

            if (branch == null)
            {
                ModelState.AddModelError("BranchId", $"Branch with ID {createProductDto.BranchId} does not exist");
                return BadRequest(ModelState);
            }

            // Check if a product with the same name already exists in the same branch
            var existingProduct = await _context.Products
                .AnyAsync(p => p.Name == createProductDto.Name.Trim() &&
                              p.BranchId == createProductDto.BranchId);

            if (existingProduct)
            {
                return Conflict(new { message = "A product with this name already exists in this branch" });
            }

            // Create entity from DTO
            var product = new Product
            {
                Name = createProductDto.Name.Trim(),
                Stock = createProductDto.Stock,
                BranchId = createProductDto.BranchId
            };

            // Save to database
            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            // Create response DTO
            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Stock = product.Stock,
                BranchId = product.BranchId,
                BranchName = branch.Name,
                FranchiseName = branch.Franchise?.Name ?? string.Empty
            };

            // Return 201 Created with resource location
            return CreatedAtAction(nameof(Get), new { id = product.Id }, productDto);
        }

        /// PUT: api/products/5
        /// Updates a complete product
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateProductDto updateProductDto)
        {
            // Validate that the ID is positive
            if (id <= 0)
            {
                return BadRequest(new { message = "ID must be greater than zero" });
            }

            // Model validation (Data Annotations)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Additional validations
            if (string.IsNullOrWhiteSpace(updateProductDto.Name))
            {
                ModelState.AddModelError("Name", "Product name is required");
                return BadRequest(ModelState);
            }

            if (updateProductDto.Stock < 0)
            {
                ModelState.AddModelError("Stock", "Stock cannot be negative");
                return BadRequest(ModelState);
            }

            // Find existing product
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }

            // Check if another product with the same name already exists in the same branch
            // (excluding the current product)
            var nameExists = await _context.Products
                .AnyAsync(p => p.Name == updateProductDto.Name.Trim() &&
                              p.BranchId == product.BranchId &&
                              p.Id != id);

            if (nameExists)
            {
                return Conflict(new { message = "Another product with this name already exists in this branch" });
            }

            // Update the entity
            product.Name = updateProductDto.Name.Trim();
            product.Stock = updateProductDto.Stock;

            // Mark as modified and save
            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // 204 No Content is the standard response for successful PUT
            return NoContent();
        }

        /// PATCH: api/products/5/stock
        /// Partially updates ONLY the stock of a product (functional requirement)
        [HttpPatch("{id}/stock")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] UpdateProductStockDto updateStockDto)
        {
            // Validate that the ID is positive
            if (id <= 0)
            {
                return BadRequest(new { message = "ID must be greater than zero" });
            }

            // Model validation (Data Annotations)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find existing product
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }

            // Update ONLY the stock
            product.Stock = updateStockDto.Stock;

            // Mark only the Stock property as modified
            _context.Entry(product).Property(p => p.Stock).IsModified = true;
            await _context.SaveChangesAsync();

            // Create response DTO with updated product
            var branch = await _context.Branches
                .Include(b => b.Franchise)
                .FirstOrDefaultAsync(b => b.Id == product.BranchId);

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Stock = product.Stock,
                BranchId = product.BranchId,
                BranchName = branch?.Name ?? string.Empty,
                FranchiseName = branch?.Franchise?.Name ?? string.Empty
            };

            return Ok(productDto);
        }

        /// DELETE: api/products/5
        /// Deletes a product
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Validate that the ID is positive
            if (id <= 0)
            {
                return BadRequest(new { message = "ID must be greater than zero" });
            }

            // Find the product
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound(new { message = $"Product with ID {id} not found" });
            }

            // Delete the product
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            // 204 No Content for successful DELETE
            return NoContent();
        }
    }
}