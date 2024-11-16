using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class NuevasTablasClaimsAppeals2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appeals_Tickets_TicketId",
                table: "Appeals");

            migrationBuilder.DropForeignKey(
                name: "FK_Appeals_UserDTO_UserId",
                table: "Appeals");

            migrationBuilder.AddForeignKey(
                name: "FK_Appeals_Tickets_TicketId",
                table: "Appeals",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appeals_UserDTO_UserId",
                table: "Appeals",
                column: "UserId",
                principalTable: "UserDTO",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appeals_Tickets_TicketId",
                table: "Appeals");

            migrationBuilder.DropForeignKey(
                name: "FK_Appeals_UserDTO_UserId",
                table: "Appeals");

            migrationBuilder.AddForeignKey(
                name: "FK_Appeals_Tickets_TicketId",
                table: "Appeals",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appeals_UserDTO_UserId",
                table: "Appeals",
                column: "UserId",
                principalTable: "UserDTO",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
