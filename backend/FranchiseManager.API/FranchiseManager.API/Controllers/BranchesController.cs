using FranchiseManager.API.Database;
using FranchiseManager.API.DTOs;
using FranchiseManager.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FranchiseManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BranchesController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// GET: api/branches
        /// Gets all branches
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BranchDto>>> Get()
        {
            var branches = await _context.Branches
                .Include(b => b.Franchise)
                .Select(b => new BranchDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    FranchiseId = b.FranchiseId,
                    FranchiseName = b.Franchise != null ? b.Franchise.Name : string.Empty
                })
                .ToListAsync();

            return Ok(branches);
        }

        /// GET: api/branches/5
        /// Gets a branch by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BranchDto>> Get(int id)
        {
            // Validate that the ID is positive
            if (id <= 0)
            {
                return BadRequest(new { message = "ID must be greater than zero" });
            }

            var branch = await _context.Branches
                .Include(b => b.Franchise)
                .Where(b => b.Id == id)
                .Select(b => new BranchDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    FranchiseId = b.FranchiseId,
                    FranchiseName = b.Franchise != null ? b.Franchise.Name : string.Empty
                })
                .FirstOrDefaultAsync();

            if (branch == null)
            {
                return NotFound(new { message = $"Branch with ID {id} not found" });
            }

            return Ok(branch);
        }

        /// GET: api/branches/franchise/5
        /// Gets all branches of a specific franchise
        [HttpGet("franchise/{franchiseId}")]
        public async Task<ActionResult<IEnumerable<BranchDto>>> GetByFranchise(int franchiseId)
        {
            // Validate that the ID is positive
            if (franchiseId <= 0)
            {
                return BadRequest(new { message = "Franchise ID must be greater than zero" });
            }

            // Check if the franchise exists
            var franchiseExists = await _context.Franchises.AnyAsync(f => f.Id == franchiseId);
            if (!franchiseExists)
            {
                return NotFound(new { message = $"Franchise with ID {franchiseId} not found" });
            }

            var branches = await _context.Branches
                .Where(b => b.FranchiseId == franchiseId)
                .Include(b => b.Franchise)
                .Select(b => new BranchDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    FranchiseId = b.FranchiseId,
                    FranchiseName = b.Franchise != null ? b.Franchise.Name : string.Empty
                })
                .ToListAsync();

            return Ok(branches);
        }

        /// POST: api/branches
        /// Creates a new branch
        [HttpPost]
        public async Task<ActionResult<BranchDto>> Post([FromBody] CreateBranchDto createBranchDto)
        {
            // Model validation (Data Annotations)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Additional name validation
            if (string.IsNullOrWhiteSpace(createBranchDto.Name))
            {
                ModelState.AddModelError("Name", "Branch name is required");
                return BadRequest(ModelState);
            }

            // Verify that the franchise exists
            var franchise = await _context.Franchises.FindAsync(createBranchDto.FranchiseId);
            if (franchise == null)
            {
                ModelState.AddModelError("FranchiseId", $"Franchise with ID {createBranchDto.FranchiseId} does not exist");
                return BadRequest(ModelState);
            }

            // Check if a branch with the same name already exists in the same franchise
            var existingBranch = await _context.Branches
                .AnyAsync(b => b.Name == createBranchDto.Name.Trim() &&
                              b.FranchiseId == createBranchDto.FranchiseId);

            if (existingBranch)
            {
                return Conflict(new { message = "A branch with this name already exists in this franchise" });
            }

            // Create entity from DTO
            var branch = new Branch
            {
                Name = createBranchDto.Name.Trim(),
                FranchiseId = createBranchDto.FranchiseId
            };

            // Save to database
            await _context.Branches.AddAsync(branch);
            await _context.SaveChangesAsync();

            // Create response DTO
            var branchDto = new BranchDto
            {
                Id = branch.Id,
                Name = branch.Name,
                FranchiseId = branch.FranchiseId,
                FranchiseName = franchise.Name
            };

            // Return 201 Created with resource location
            return CreatedAtAction(nameof(Get), new { id = branch.Id }, branchDto);
        }

        /// PUT: api/branches/5
        /// Updates an existing branch
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateBranchDto updateBranchDto)
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

            // Additional name validation
            if (string.IsNullOrWhiteSpace(updateBranchDto.Name))
            {
                ModelState.AddModelError("Name", "Branch name is required");
                return BadRequest(ModelState);
            }

            // Find existing branch
            var branch = await _context.Branches.FindAsync(id);
            if (branch == null)
            {
                return NotFound(new { message = $"Branch with ID {id} not found" });
            }

            // Verify that the new franchise exists (if changed)
            if (branch.FranchiseId != updateBranchDto.FranchiseId)
            {
                var newFranchise = await _context.Franchises.FindAsync(updateBranchDto.FranchiseId);
                if (newFranchise == null)
                {
                    ModelState.AddModelError("FranchiseId", $"Franchise with ID {updateBranchDto.FranchiseId} does not exist");
                    return BadRequest(ModelState);
                }
            }

            // Check if another branch with the same name already exists in the same franchise
            // (excluding the current branch)
            var nameExists = await _context.Branches
                .AnyAsync(b => b.Name == updateBranchDto.Name.Trim() &&
                              b.FranchiseId == updateBranchDto.FranchiseId &&
                              b.Id != id);

            if (nameExists)
            {
                return Conflict(new { message = "Another branch with this name already exists in this franchise" });
            }

            // Update the entity
            branch.Name = updateBranchDto.Name.Trim();
            branch.FranchiseId = updateBranchDto.FranchiseId;

            // Mark as modified and save
            _context.Entry(branch).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // 204 No Content is the standard response for successful PUT
            return NoContent();
        }

        /// DELETE: api/branches/5
        /// Deletes a branch (only if it has no products)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Validate that the ID is positive
            if (id <= 0)
            {
                return BadRequest(new { message = "ID must be greater than zero" });
            }

            // Find the branch including its products
            var branch = await _context.Branches
                .Include(b => b.Products)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (branch == null)
            {
                return NotFound(new { message = $"Branch with ID {id} not found" });
            }

            // Check if it has associated products
            if (branch.Products != null && branch.Products.Any())
            {
                return BadRequest(new { message = "Cannot delete branch because it has associated products" });
            }

            // Delete the branch
            _context.Branches.Remove(branch);
            await _context.SaveChangesAsync();

            // 204 No Content for successful DELETE
            return NoContent();
        }
    }
}