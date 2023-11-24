using System.ComponentModel.DataAnnotations;

namespace MiniProjet_.NET.Models.ViewModels.Auth
{
    public class CreateRoleViewModel
    {
        [Required]
        [Display(Name = "Role")]
        public string RoleName { get; set; }
    }
}
