using System.ComponentModel.DataAnnotations;

namespace FranchiseManager.API.Models
{
    public class Branch
    {
        // Unique identifier for the branch
        public int Id { get; set; }

        // Branch name - required field
        [Required(ErrorMessage = "Branch name is required")]
        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        [MinLength(3, ErrorMessage = "Name must be at least 3 characters long")]
        [Display(Name = "Branch Name")]
        public string Name { get; set; } = string.Empty;

        // Foreign key: ID of the franchise it belongs to
        [Required(ErrorMessage = "Franchise is required")]
        [Display(Name = "Franchise ID")]
        public int FranchiseId { get; set; }

        // Navigation property: franchise it belongs to
        public Franchise? Franchise { get; set; }

        // Relationship: one branch has many products
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}