"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Team } from "@/lib/database.types";

const RANK_BADGE = ["🥇", "🥈", "🥉"];

/**
 * Tabla pública del marcador. Solo lectura: muestra el ranking de equipos
 * por puntos. El nombre del equipo despliega una fila con sus integrantes.
 */
export function ScoreboardTable({ teams }: { teams: Team[] }) {
  // Varios equipos pueden estar desplegados a la vez.
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  if (teams.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
        <p className="text-lg">Aún no hay equipos en competición.</p>
        <p className="text-sm">
          El profesorado debe registrar los equipos para que comience la competición.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">Puesto</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead className="text-right">Puntos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => {
            const hasMembers = team.members.length > 0;
            const isOpen = hasMembers && expanded.has(team.id);

            return (
              <React.Fragment key={team.id}>
                <TableRow
                  className={cn(
                    index === 0 && "bg-accent/30",
                    isOpen && "border-b-0",
                  )}
                >
                  <TableCell className="text-center text-xl">
                    {RANK_BADGE[index] ?? (
                      <span className="text-base font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-heading text-base font-semibold">
                    {hasMembers ? (
                      <button
                        type="button"
                        onClick={() => toggle(team.id)}
                        aria-expanded={isOpen}
                        aria-controls={`integrantes-${team.id}`}
                        className="flex w-full cursor-pointer items-center gap-1.5 rounded-sm text-left font-heading text-base font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span>{team.name}</span>
                        <ChevronDown
                          aria-hidden
                          className={cn(
                            "size-4 shrink-0 text-muted-foreground transition-transform",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>
                    ) : (
                      team.name
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-lg font-bold tabular-nums text-primary">
                    {team.points}
                  </TableCell>
                </TableRow>

                {isOpen && (
                  <TableRow
                    id={`integrantes-${team.id}`}
                    className={cn(index === 0 && "bg-accent/30")}
                  >
                    <TableCell />
                    <TableCell
                      colSpan={2}
                      className="whitespace-normal p-2 pt-0 align-top"
                    >
                      <ul className="space-y-1 pl-1 text-sm font-normal text-muted-foreground">
                        {team.members.map((member, i) => (
                          <li key={`${member}-${i}`}>{member}</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
