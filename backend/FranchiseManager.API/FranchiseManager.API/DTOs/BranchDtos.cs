using System.ComponentModel.DataAnnotations;

namespace FranchiseManager.API.DTOs
{
    // For GET responses (list/get)
    public class BranchDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int FranchiseId { get; set; }
        public string FranchiseName { get; set; } = string.Empty; // To display the franchise name
    }

    // For creating a new branch (POST)
    public class CreateBranchDto
    {
        [Required(ErrorMessage = "Branch name is required")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters long")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Franchise is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Franchise ID must be greater than zero")]
        public int FranchiseId { get; set; }
    }

    // For updating a branch (PUT)
    public class UpdateBranchDto
    {
        [Required(ErrorMessage = "Branch name is required")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters long")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Franchise is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Franchise ID must be greater than zero")]
        public int FranchiseId { get; set; }
    }
}