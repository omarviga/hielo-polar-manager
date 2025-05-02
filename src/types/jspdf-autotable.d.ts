// filepath: c:\Users\oviey\Documents\hielo-polar-manager\src\types\jspdf-autotable.d.ts
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}