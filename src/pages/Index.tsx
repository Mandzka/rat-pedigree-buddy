import { useState, useEffect } from "react";
import { Rat } from "@/types/rat";
import { RatCard } from "@/components/RatCard";
import { AddRatDialog } from "@/components/AddRatDialog";
import { RatDetailsDialog } from "@/components/RatDetailsDialog";
import { EditRatDialog } from "@/components/EditRatDialog";
import { BreedingSimulator } from "@/components/BreedingSimulator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

const Index = () => {
  const [rats, setRats] = useState<Rat[]>([]);
  const [selectedRat, setSelectedRat] = useState<Rat | null>(null);
  const [editingRat, setEditingRat] = useState<Rat | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSex, setFilterSex] = useState<string>("all");
  const [filterBreeding, setFilterBreeding] = useState<string>("all");

  // Load rats from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("rats");
    if (stored) {
      setRats(JSON.parse(stored));
    }
  }, []);

  // Save rats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("rats", JSON.stringify(rats));
  }, [rats]);

  const handleAddRat = (rat: Rat) => {
    setRats([...rats, rat]);
  };

  const handleUpdateRat = (updatedRat: Rat) => {
    setRats(rats.map(r => r.id === updatedRat.id ? updatedRat : r));
  };

  const filteredRats = rats.filter((rat) => {
    const matchesSearch = rat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rat.coatColor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSex = filterSex === "all" || rat.sex === filterSex;
    const matchesBreeding = filterBreeding === "all" || 
                           (filterBreeding === "approved" && rat.breedingApproved) ||
                           (filterBreeding === "not-approved" && !rat.breedingApproved);
    
    return matchesSearch && matchesSex && matchesBreeding;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-glow to-primary">
        <div className="h-64 relative flex items-center justify-center">
          <h1 className="text-7xl md:text-8xl font-bold text-white drop-shadow-2xl tracking-tight font-serif">
            Pokeratos Rattery
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Total de Ratos</p>
            <p className="text-3xl font-bold">{rats.length}</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
            <p className="text-sm text-muted-foreground mb-1">Machos</p>
            <p className="text-3xl font-bold">{rats.filter(r => r.sex === "Macho").length}</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-1">Fêmeas</p>
            <p className="text-3xl font-bold">{rats.filter(r => r.sex === "Fêmea").length}</p>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Reprodutores</p>
            <p className="text-3xl font-bold">{rats.filter(r => r.breedingApproved).length}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Buscar por nome ou cor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterSex} onValueChange={setFilterSex}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Macho">Machos</SelectItem>
                <SelectItem value="Fêmea">Fêmeas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterBreeding} onValueChange={setFilterBreeding}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Reprodução" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="approved">Reprodutores</SelectItem>
                <SelectItem value="not-approved">Não Reprodutores</SelectItem>
              </SelectContent>
            </Select>
            <BreedingSimulator rats={rats} />
            <AddRatDialog onAddRat={handleAddRat} allRats={rats} />
          </div>
        </div>

        {/* Rats Grid */}
        {filteredRats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRats.map((rat) => (
              <RatCard
                key={rat.id}
                rat={rat}
                onClick={() => setSelectedRat(rat)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground mb-4">
              {searchTerm || filterSex !== "all" || filterBreeding !== "all"
                ? "Nenhum rato encontrado com os filtros aplicados"
                : "Nenhum rato cadastrado ainda"}
            </p>
            {!searchTerm && filterSex === "all" && filterBreeding === "all" && (
              <AddRatDialog onAddRat={handleAddRat} allRats={rats} />
            )}
          </div>
        )}
      </div>

      {/* Rat Details Dialog */}
      <RatDetailsDialog
        rat={selectedRat}
        open={!!selectedRat}
        onOpenChange={(open) => !open && setSelectedRat(null)}
        onEdit={(rat) => {
          setEditingRat(rat);
          setSelectedRat(null);
        }}
        allRats={rats}
      />

      {/* Edit Rat Dialog */}
      {editingRat && (
        <EditRatDialog
          rat={editingRat}
          open={!!editingRat}
          onOpenChange={(open) => !open && setEditingRat(null)}
          onSave={handleUpdateRat}
          allRats={rats}
        />
      )}
    </div>
  );
};

export default Index;
