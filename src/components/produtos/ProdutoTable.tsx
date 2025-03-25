
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, Layers, PencilIcon, TrashIcon } from "lucide-react";
import { Product } from "@/types/supabase";

interface ProdutoTableProps {
  produtos: Product[];
  isLoading: boolean;
  diasPrazoMap: (dias: number) => string;
  onEdit: (produto: Product) => void;
  onDelete: (id: string) => void;
}

const ProdutoTable: React.FC<ProdutoTableProps> = ({
  produtos,
  isLoading,
  diasPrazoMap,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead className="hidden md:table-cell">Modelo</TableHead>
            <TableHead className="hidden lg:table-cell">Prazo Manutenção</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : produtos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          ) : (
            produtos.map((produto) => (
              <TableRow key={produto.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{produto.id.substring(0, 8)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-hoken-100 rounded-full flex items-center justify-center">
                      <Layers className="h-4 w-4 text-hoken-600" />
                    </div>
                    {produto.name}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{produto.categoria}</TableCell>
                <TableCell className="hidden md:table-cell">{produto.model || "-"}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {diasPrazoMap(produto.maintenance_interval_days)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(produto)}>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(produto.id)}
                        className="text-destructive"
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProdutoTable;
