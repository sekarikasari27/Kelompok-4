export interface Progres {
  modulDibuka: string[];
  skorKuis: Record<string, number>;
}

const KUNCI_PROGRES = 'lajuku:progres';

const PROGRES_AWAL: Progres = { modulDibuka: [], skorKuis: {} };

export function bacaProgres(): Progres {
  try {
    const mentah = window.localStorage.getItem(KUNCI_PROGRES);
    if (!mentah) return PROGRES_AWAL;
    const data = JSON.parse(mentah) as Partial<Progres>;
    return {
      modulDibuka: Array.isArray(data.modulDibuka) ? data.modulDibuka : [],
      skorKuis: data.skorKuis && typeof data.skorKuis === 'object' ? data.skorKuis : {},
    };
  } catch {
    return PROGRES_AWAL;
  }
}

export function simpanProgres(progres: Progres): void {
  try {
    window.localStorage.setItem(KUNCI_PROGRES, JSON.stringify(progres));
  } catch {
    // Penyimpanan diblokir: aplikasi tetap berjalan tanpa menyimpan progres.
  }
}
