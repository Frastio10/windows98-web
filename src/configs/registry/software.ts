const SOFTWARE_REGISTRY = {
  fileTypes: {
    txt: {
      defaultApp: {
        name: "Notepad",
        path: "C:/WINDOWS/notepad.exe",
        arguments: "%1",
      },
      alternativeApps: [
        // {
        //   name: "Notepad++",
        //   path: "C:/Program Files/Notepad++/notepad++.exe",
        //   arguments: "%1",
        // },
      ],
      defaultIcon: {
        source: "notepad_file",
        sizes: [16, 32, 48, 256],
        colorDepth: 32,
        hasTransparency: true,
      },
      mimeType: "text/plain",
      description: "Text Document",
    },
    exe: {
      defaultIcon: {
        source: "executable",
        sizes: [16, 32, 48, 256],
        colorDepth: 32,
        hasTransparency: true,
      },
      mimeType: "application/x-executable",
      description: "Executable File",
    },
    jpg: {
      defaultApp: {
        name: "Windows Photos",
        path: "C:/Windows/System32/Shell/PhotoViewer.dll",
        arguments: "%1",
      },
      defaultIcon: {
        source: "jpg_file",
        sizes: [16, 32, 48, 256],
        colorDepth: 32,
        hasTransparency: true,
      },
      mimeType: "image/jpeg",
      description: "JPEG Image",
    },
    pdf: {
      defaultIcon: {
        source: "pdf_file",
        sizes: [16, 32, 48, 256],
        colorDepth: 32,
        hasTransparency: true,
      },
      mimeType: "application/pdf",
      description: "PDF Document",
    },
  },
  systemFolders: {
    Documents: {
      defaultIcon: {
        source: "document",
        index: 0,
        sizes: [16, 32, 48, 256],
        colorDepth: 32,
        hasTransparency: true,
      },
      path: "C:/WINDOWS/Documents",
    },
    Downloads: {
      defaultIcon: {
        source: "shell32.dll",
        index: 49,
        sizes: [16, 32, 48, 256],
        colorDepth: 32,
        hasTransparency: true,
      },
      path: "C:/WINDOWS/Documents",
    },
  },
};

export default SOFTWARE_REGISTRY;
