using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class NuevasTablasClaimsAppeals22 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appeals_Claims_ClaimId",
                table: "Appeals");

            migrationBuilder.AddForeignKey(
                name: "FK_Appeals_Claims_ClaimId",
                table: "Appeals",
                column: "ClaimId",
                principalTable: "Claims",
                principalColumn: "ClaimId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appeals_Claims_ClaimId",
                table: "Appeals");

            migrationBuilder.AddForeignKey(
                name: "FK_Appeals_Claims_ClaimId",
                table: "Appeals",
                column: "ClaimId",
                principalTable: "Claims",
                principalColumn: "ClaimId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
