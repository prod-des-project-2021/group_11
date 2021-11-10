if error 1181
	windows -> 	https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16
			install c++ 2019 build tools
	
	using gcc to compile -> 
			rustup uninstall toolchain stable-x86_64-pc-windows-msvc
			rustup toolchain install stable-x86_64-pc-windows-gnu
			rustup default stable-x86_64-pc-windows-gnu
		if this doesn't work, install MinGw, then try again				
        
        If all else fails, delete 'target' folder.