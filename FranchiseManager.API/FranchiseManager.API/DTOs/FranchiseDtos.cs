using System.ComponentModel.DataAnnotations;

namespace FranchiseManager.API.DTOs
{
    // DTO for GET responses (list/get franchises)
    public class FranchiseDto
    {
        // Unique identifier for the franchise
        public int Id { get; set; }

        // Franchise name
        public string Name { get; set; } = string.Empty;
    }

    // DTO for creating a new franchise (POST)
    public class CreateFranchiseDto
    {
        // Franchise name - required
        [Required(ErrorMessage = "Franchise name is required")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters long")]
        [Display(Name = "Franchise Name")]
        public string Name { get; set; } = string.Empty;
    }

    // DTO for updating a franchise (PUT)
    public class UpdateFranchiseDto
    {
        // Franchise name - required
        [Required(ErrorMessage = "Franchise name is required")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters long")]
        [Display(Name = "Franchise Name")]
        public string Name { get; set; } = string.Empty;
    }
}