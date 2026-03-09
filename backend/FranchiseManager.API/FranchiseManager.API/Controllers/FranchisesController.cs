using FranchiseManager.API.Database;
using FranchiseManager.API.DTOs;
using FranchiseManager.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FranchiseManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FranchisesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FranchisesController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// GET: api/franchises
        /// Gets all franchises
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FranchiseDto>>> Get()
        {
            // Query all franchises and project them to FranchiseDto
            var franchises = await _context.Franchises
                .Select(f => new FranchiseDto
                {
                    Id = f.Id,
                    Name = f.Name
                })
                .ToListAsync();

            return Ok(franchises);
        }

        /// GET: api/franchises/5
        /// Gets a franchise by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<FranchiseDto>> Get(int id)
        {
            // Validate that the ID is positive
            if (id <= 0)
            {
                return BadRequest(new { message = "ID must be greater than zero" });
            }

            // Search for franchise by ID and project it to FranchiseDto
            var franchise = await _context.Franchises
                .Where(f => f.Id == id)
                .Select(f => new FranchiseDto
                {
                    Id = f.Id,
                    Name = f.Name
                })
                .FirstOrDefaultAsync();

            // If it doesn't exist, return 404
            if (franchise == null)
            {
                return NotFound(new { message = $"Franchise with ID {id} not found" });
            }

            return Ok(franchise);
        }

        /// POST: api/franchises
        /// Creates a new franchise
        [HttpPost]
        public async Task<ActionResult<FranchiseDto>> Post([FromBody] CreateFranchiseDto createFranchiseDto)
        {
            // Model validation (Data Annotations)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Note: Name validation is already handled by Data Annotations,
            // but we keep this for compatibility
            if (string.IsNullOrWhiteSpace(createFranchiseDto.Name))
            {
                ModelState.AddModelError("Name", "Franchise name is required");
                return BadRequest(ModelState);
            }

            // Check if a franchise with the same name already exists
            var existingFranchise = await _context.Franchises
                .AnyAsync(f => f.Name == createFranchiseDto.Name);

            if (existingFranchise)
            {
                return Conflict(new { message = "A franchise with this name already exists" });
            }

            // Create entity from DTO
            var franchise = new Franchise
            {
                Name = createFranchiseDto.Name.Trim() // Remove leading/trailing whitespace
            };

            // Save to database
            await _context.Franchises.AddAsync(franchise);
            await _context.SaveChangesAsync();

            // Create response DTO
            var franchiseDto = new FranchiseDto
            {
                Id = franchise.Id,
                Name = franchise.Name
            };

            // Return 201 Created with resource location
            return CreatedAtAction(nameof(Get), new { id = franchise.Id }, franchiseDto);
        }

        /// PUT: api/franchises/5
        /// Updates an existing franchise
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] UpdateFranchiseDto updateFranchiseDto)
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

            // Note: Name validation is already handled by Data Annotations
            if (string.IsNullOrWhiteSpace(updateFranchiseDto.Name))
            {
                ModelState.AddModelError("Name", "Franchise name is required");
                return BadRequest(ModelState);
            }

            // Find existing franchise
            var franchise = await _context.Franchises.FindAsync(id);

            if (franchise == null)
            {
                return NotFound(new { message = $"Franchise with ID {id} not found" });
            }

            // Check if the new name already exists (except for the same franchise)
            var nameExists = await _context.Franchises
                .AnyAsync(f => f.Name == updateFranchiseDto.Name && f.Id != id);

            if (nameExists)
            {
                return Conflict(new { message = "Another franchise with this name already exists" });
            }

            // Update the entity
            franchise.Name = updateFranchiseDto.Name.Trim(); // Remove whitespace

            // Mark as modified and save
            _context.Entry(franchise).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            // 204 No Content is the standard response for successful PUT
            return NoContent();
        }

        /// DELETE: api/franchises/5
        /// Deletes a franchise (only if it has no branches)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Validate that the ID is positive
            if (id <= 0)
            {
                return BadRequest(new { message = "ID must be greater than zero" });
            }

            // Find the franchise
            var franchise = await _context.Franchises.FindAsync(id);

            if (franchise == null)
            {
                return NotFound(new { message = $"Franchise with ID {id} not found" });
            }

            // Check if it has associated branches
            var hasBranches = await _context.Branches.AnyAsync(b => b.FranchiseId == id);
            if (hasBranches)
            {
                return BadRequest(new { message = "Cannot delete franchise because it has associated branches" });
            }

            // Delete the franchise
            _context.Franchises.Remove(franchise);
            await _context.SaveChangesAsync();

            // 204 No Content for successful DELETE
            return NoContent();
        }
    }
}