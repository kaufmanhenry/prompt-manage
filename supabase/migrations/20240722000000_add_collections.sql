-- collections table
CREATE TABLE public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- prompt_collections join table
CREATE TABLE public.prompt_collections (
    prompt_id UUID REFERENCES public.prompts ON DELETE CASCADE,
    collection_id UUID REFERENCES public.collections ON DELETE CASCADE,
    PRIMARY KEY (prompt_id, collection_id)
);

-- RLS for collections
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own collections"
ON public.collections
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read public collections"
ON public.collections
FOR SELECT
USING (is_public = true);

-- RLS for prompt_collections
ALTER TABLE public.prompt_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own prompt_collections"
ON public.prompt_collections
FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.prompts p
    WHERE p.id = prompt_id AND p.user_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.prompts p
    WHERE p.id = prompt_id AND p.user_id = auth.uid()
));

CREATE POLICY "Anyone can read prompt_collections for public prompts"
ON public.prompt_collections
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.prompts p
    JOIN public.collections c ON c.id = collection_id
    WHERE p.id = prompt_id AND p.is_public = true AND c.is_public = true
)); 