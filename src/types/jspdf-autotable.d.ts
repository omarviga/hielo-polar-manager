// filepath: c:\Users\oviey\Documents\hielo-polar-manager\src\types\jspdf-autotable.d.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}