using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class CorreccionModelos3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Agregar la columna TicketId a la tabla Claims
            migrationBuilder.AddColumn<int>(
                name: "TicketId",
                table: "Claims",
                nullable: true);

            // Agregar la restricción de clave foránea entre Claims y Tickets
            migrationBuilder.AddForeignKey(
                name: "FK_Claims_Tickets_TicketId",
                table: "Claims",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict); // Ajusta el comportamiento de eliminación según tus necesidades
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Eliminar la clave foránea
            migrationBuilder.DropForeignKey(
                name: "FK_Claims_Tickets_TicketId",
                table: "Claims");

            // Eliminar la columna TicketId de la tabla Claims
            migrationBuilder.DropColumn(
                name: "TicketId",
                table: "Claims");
        }
    }
}
